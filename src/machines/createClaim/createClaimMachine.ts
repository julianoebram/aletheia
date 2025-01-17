import { createMachine } from "xstate";
import {
    CreateClaimEvents as Events,
    CreateClaimStates as States,
} from "./types";
import { CreateClaimMachineEvents } from "./events";
import { CreateClaimMachineStates } from "./states";
import {
    persistClaim,
    saveClaimContext,
    startImage,
    startSpeech,
} from "./actions";
import { CreateClaimContext } from "./context";

export const newCreateClaimMachine = ({ value, context }) => {
    return createMachine<
        CreateClaimContext,
        CreateClaimMachineEvents,
        CreateClaimMachineStates
    >({
        initial: value,
        context,
        states: {
            [States.notStarted]: {
                on: {
                    [Events.startSpeech]: {
                        target: States.setupSpeech,
                        actions: [startSpeech],
                    },
                    [Events.startImage]: {
                        target: States.setupImage,
                        actions: [startImage],
                    },
                },
            },
            [States.setupSpeech]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.setupSpeech,
                        actions: [saveClaimContext],
                    },
                    [Events.savePersonality]: {
                        target: States.personalityAdded,
                    },
                },
            },
            [States.setupImage]: {
                on: {
                    [Events.addPersonality]: {
                        target: States.setupImage,
                        actions: [saveClaimContext],
                    },
                    [Events.noPersonality]: {
                        target: States.personalityAdded,
                        actions: [saveClaimContext],
                    },
                    [Events.savePersonality]: {
                        target: States.personalityAdded,
                    },
                },
            },
            [States.personalityAdded]: {
                on: {
                    [Events.persist]: {
                        target: States.persisted,
                        actions: [persistClaim],
                    },
                },
            },
            [States.persisted]: {
                type: "final",
            },
        },
    });
};
