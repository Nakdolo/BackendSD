import {IsNotEmpty,IsEmail, IsString} from "class-validator";

export class passwordRecovoryDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}
