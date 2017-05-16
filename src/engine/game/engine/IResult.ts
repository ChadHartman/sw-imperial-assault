namespace SwiaEngine.Game.Engine {
    export interface IResult {
        success: boolean;
        message?: string;
    }

    export const SUCCESS = { success: true };

    export function failure(reason?: string): IResult {
        return {
            success: false,
            message: reason
        }
    }

}