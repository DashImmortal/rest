import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";


export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    id: bigint;
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop()
    avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);