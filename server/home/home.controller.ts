import { Controller, Get, Header, Req, Res } from "@nestjs/common";
import { ViewService } from "../view/view.service";
import { Response } from "express";
import { parse } from "url";
import { PersonalityService } from "../personality/personality.service";
import { StatsService } from "../stats/stats.service";
import { IsPublic } from "../decorators/is-public.decorator";
import { BaseRequest } from "../types";
import { ClaimCollectionService } from "../claim-collection/claim-collection.service";

@Controller("/")
export class HomeController {
    constructor(
        private viewService: ViewService,
        private personalityService: PersonalityService,
        private statsService: StatsService,
        private claimCollectionService: ClaimCollectionService
    ) {}

    @Get("/home")
    /**
     * Redirect /home to / for backwards compatibility
     * @param res
     */
    redirect(@Res() res) {
        return res.redirect("/");
    }

    @IsPublic()
    @Get()
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async showHome(@Req() req: BaseRequest, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const { personalities } = await this.personalityService.combinedListAll(
            {
                language: req.language,
                order: "random",
                pageSize: 6,
                fetchOnly: true,
            }
        );

        const rawClaimCollections = await this.claimCollectionService.listAll(
            0,
            6,
            "asc",
            {}
        );

        const claimCollections = await Promise.all(
            rawClaimCollections.map(async (claimCollection) => {
                claimCollection.personalities = await Promise.all(
                    claimCollection.personalities.map(async (p) => {
                        return await this.personalityService.postProcess(
                            p,
                            req.language
                        );
                    })
                );
                return claimCollection;
            })
        );

        const stats = await this.statsService.getHomeStats();
        await this.viewService.getNextServer().render(
            req,
            res,
            "/home-page",
            Object.assign(parsedUrl.query, {
                personalities,
                stats,
                claimCollections,
            })
        );
    }
}
