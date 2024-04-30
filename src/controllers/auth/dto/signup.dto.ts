import {IsNotEmpty, IsString, IsEmail} from "class-validator";

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  surName!: string

  @IsString()
  @IsNotEmpty()
  phone!: string

  @IsString()
  @IsNotEmpty()
  userRole!: string;

  @IsString()
  @IsNotEmpty()
  ID!: string;
}

// //name: String,
// surName: String,
// phone: String,