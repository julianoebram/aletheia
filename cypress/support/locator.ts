const locators = {
    LOGIN: {
        USER: "#basic_email",
        PASSWORD: "#basic_password",
        BTN_LOGIN: "[data-cy=loginButton]",
    },

    PERSONALITY: {
        BTN_SEE_MORE_PERSONALITY: "[data-cy=testSeeMorePersonality]",
        BTN_ADD_PERSONALITY: "[data-cy=testButtonCreatePersonality]",
        INPUT_SEARCH_PERSONALITY: "[data-cy=testInputSearchPersonality]",
    },

    CLAIM_REVIEW: {
        BTN_START_CLAIM_REVIEW: "[data-cy=testAddReviewButton]",
    },

    MENU: {
        SIDE_MENU: "[data-cy=testSideMenuClosed]"
    }
};
export default locators;