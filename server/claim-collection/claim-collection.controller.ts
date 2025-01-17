import {
    Body,
    Controller,
    Post,
    Param,
    Get,
    Put,
    Query,
    Req,
    Res,
    Header,
    UseGuards,
} from "@nestjs/common";
import { ClaimCollectionService } from "./claim-collection.service";
import { CreateClaimCollectionDto } from "./dto/create-claim-collection.dto";
import { UpdateClaimCollectionDto } from "./dto/update-claim-collection.dto";
import { CaptchaService } from "../captcha/captcha.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { parse } from "url";
import { Response } from "express";
import { ViewService } from "../view/view.service";
import { PersonalityService } from "../personality/personality.service";
import { BaseRequest } from "../types";
import { ConfigService } from "@nestjs/config";
import { AbilitiesGuard } from "../ability/abilities.guard";
import { AdminUserAbility, CheckAbilities } from "../ability/ability.decorator";

@Controller()
export class ClaimCollectionController {
    constructor(
        private claimCollectionService: ClaimCollectionService,
        private personalityService: PersonalityService,
        private captchaService: CaptchaService,
        private viewService: ViewService,
        private configService: ConfigService
    ) {}

    @IsPublic()
    @Get("api/claim-collection")
    @Header("Cache-Control", "max-age=30, must-revalidate")
    public async getClaimCollectionList(
        @Query() getClaimCollectionListDTO: any
    ) {
        const {
            page = 0,
            pageSize = 10,
            order = 1,
            value,
        } = getClaimCollectionListDTO;
        return Promise.all([
            this.claimCollectionService.listAll(page, pageSize, order, value),
            this.claimCollectionService.count(),
        ]).then(([tasks, totalTasks]) => {
            const totalPages = Math.ceil(totalTasks / pageSize);

            return {
                tasks,
                totalTasks,
                totalPages,
                page,
                pageSize,
            };
        });
    }

    @IsPublic()
    @Get("api/claim-collection/:id")
    @Header("Cache-Control", "max-age=30, must-revalidate")
    async getById(@Param("id") id: string, @Query() query) {
        const { reverse, lastCollectionItem } = query;
        return this.claimCollectionService.getById(
            id,
            true,
            reverse,
            lastCollectionItem
        );
    }

    @Post("api/claim-collection")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async create(@Body() createClaimCollection: CreateClaimCollectionDto) {
        // const validateCaptcha = await this.captchaService.validate(
        //     createClaimCollection.recaptcha
        // );
        // if (!validateCaptcha) {
        //     throw new Error("Error validating captcha");
        // }
        return this.claimCollectionService.create(createClaimCollection);
    }

    @Put("api/claim-collection/:id")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    async autoSaveDraft(
        @Param("id") claimCollectionId,
        @Body() claimCollectionBody: UpdateClaimCollectionDto
    ) {
        // const history = false;
        return this.claimCollectionService.update(
            claimCollectionId,
            claimCollectionBody
            // history
        );
    }

    @IsPublic()
    @Get("claim-collection/:id")
    @Header("Cache-Control", "max-age=30, must-revalidate")
    public async claimCollection(
        @Param("id") claimCollectionId,
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const claimCollection: any = await this.claimCollectionService.getById(
            claimCollectionId,
            true,
            true
        );

        claimCollection.personalities = await Promise.all(
            claimCollection.personalities.map(async (p) => {
                return await this.personalityService.postProcess(
                    p,
                    req.language
                );
            })
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-collection-view",
            Object.assign(parsedUrl.query, {
                claimCollection,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }

    @Get("claim-collection/:id/edit")
    @UseGuards(AbilitiesGuard)
    @CheckAbilities(new AdminUserAbility())
    public async claimCollectionEdit(
        @Param("id") claimCollectionId,
        @Req() req: BaseRequest,
        @Res() res: Response
    ) {
        const parsedUrl = parse(req.url, true);

        const claimCollection: any = await this.claimCollectionService.getById(
            claimCollectionId
        );

        await this.viewService.getNextServer().render(
            req,
            res,
            "/claim-collection-editor",
            Object.assign(parsedUrl.query, {
                claimCollection,
                sitekey: this.configService.get<string>("recaptcha_sitekey"),
            })
        );
    }
}
