import { ValidationError } from "class-validator";

export class Utils {
  public static getErrorMessages(errors: ValidationError[]): string[] {
    let errorTexts: string[] = [];

    if (errors.length > 0) {
      for (const errorItem of errors) {
        if (errorItem.constraints) {
          const keys = Object.keys(errorItem.constraints);

          for (const key of keys) {
            errorTexts = errorTexts.concat(errorItem.constraints[key]);
          }
        }
      }
    }

    return errorTexts;
  }
}
