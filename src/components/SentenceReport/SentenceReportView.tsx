import React, { useState } from "react";
import { Col, Row } from "antd";
import SocialMediaShare from "../SocialMediaShare";
import SentenceReportCard from "./SentenceReportCard";
import Banner from "./Banner";
import CTARegistration from "../Home/CTARegistration";
import SentenceReportViewStyle from "./SentenceReportView.style";
import SentenceReportContent from "./SentenceReportContent";
import { useAppSelector } from "../../store/store";
import ReviewApi from "../../api/claimReviewApi";
import { useTranslation } from "next-i18next";
import HideReviewModal from "../Modal/HideReviewModal";
import UnhideReviewModal from "../Modal/UnhideReviewModal";
import AletheiaAlert from "../AletheiaAlert";
import HideContentButton from "../HideContentButton";
import { Roles } from "../../machine/enums";
import colors from "../../styles/colors";

const SentenceReportView = ({
    personality,
    claim,
    sentence,
    href,
    isHidden,
    context,
    sitekey,
    hideDescription,
}) => {
    const { t } = useTranslation();
    const { isLoggedIn, role } = useAppSelector((state) => {
        return {
            isLoggedIn: state?.login,
            role: state?.role,
        };
    });

    const [isHideModalVisible, setIsHideModalVisible] = useState(false);
    const [isUnhideModalVisible, setIsUnhideModalVisible] = useState(false);
    const [description, setDescription] = useState(hideDescription);
    const [hide, setHide] = useState(isHidden);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <SentenceReportViewStyle>
                <Row>
                    <Col offset={3} span={18}>
                        {role === Roles.Admin && (
                            <Col
                                style={{
                                    marginBottom: 8,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                        borderBottom: `1px solid ${colors.lightGraySecondary}`,
                                    }}
                                ></div>
                                <HideContentButton
                                    hide={hide}
                                    handleHide={() => {
                                        setIsUnhideModalVisible(
                                            !isUnhideModalVisible
                                        );
                                    }}
                                    handleUnhide={() =>
                                        setIsHideModalVisible(
                                            !isHideModalVisible
                                        )
                                    }
                                    style={{
                                        borderBottom: `1px solid ${colors.bluePrimary}`,
                                        width: 26,
                                    }}
                                />
                            </Col>
                        )}
                        <Row>
                            <Col
                                lg={{ order: 1, span: 16 }}
                                md={{ order: 2, span: 24 }}
                                sm={{ order: 2, span: 24 }}
                                xs={{ order: 2, span: 24 }}
                                className="sentence-report-card"
                            >
                                <SentenceReportCard
                                    personality={personality}
                                    claim={claim}
                                    sentence={sentence}
                                    context={context}
                                />
                            </Col>
                            <Col
                                lg={{ order: 2, span: 8 }}
                                md={{ order: 1, span: 24 }}
                            >
                                <Banner />
                            </Col>

                            {hide && (
                                <Col
                                    style={{ marginTop: 16, width: "100%" }}
                                    order={3}
                                >
                                    <AletheiaAlert
                                        type="warning"
                                        message={t(
                                            "claimReview:warningAlertTitle"
                                        )}
                                        description={description}
                                        showIcon={true}
                                    />
                                </Col>
                            )}

                            <Col order={4}>
                                <SentenceReportContent
                                    context={context}
                                    personality={personality}
                                    claim={claim}
                                />
                            </Col>
                        </Row>
                        {!isLoggedIn && <CTARegistration />}
                    </Col>
                    <Col span={24}>
                        <SocialMediaShare
                            quote={personality?.name}
                            href={href}
                            claim={claim?.title}
                        />
                    </Col>
                </Row>
            </SentenceReportViewStyle>

            <HideReviewModal
                visible={isHideModalVisible}
                isLoading={isLoading}
                handleOk={({ description, recaptcha }) => {
                    setIsLoading(true);
                    ReviewApi.hideReview(
                        sentence.data_hash,
                        !hide,
                        t,
                        recaptcha,
                        description
                    ).then(() => {
                        setHide(!hide);
                        setIsHideModalVisible(!isHideModalVisible);
                        setDescription(description);
                        setIsLoading(false);
                    });
                }}
                handleCancel={() => setIsHideModalVisible(false)}
                sitekey={sitekey}
            />

            <UnhideReviewModal
                visible={isUnhideModalVisible}
                isLoading={isLoading}
                handleOk={({ recaptcha }) => {
                    setIsLoading(true);
                    ReviewApi.hideReview(
                        sentence.data_hash,
                        !hide,
                        t,
                        recaptcha
                    ).then(() => {
                        setHide(!hide);
                        setIsUnhideModalVisible(!isUnhideModalVisible);
                        setIsLoading(false);
                    });
                }}
                handleCancel={() =>
                    setIsUnhideModalVisible(!isUnhideModalVisible)
                }
                sitekey={sitekey}
            />
        </>
    );
};

export default SentenceReportView;