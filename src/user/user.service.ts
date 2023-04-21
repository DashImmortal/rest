import { Model } from 'mongoose'
import { InjectModel} from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) 
    private userModel: Model<UserDocument>) {
    }
    
    async createUser(user: User): Promise<User> {
        const newUser = new this.userModel(User);
        return newUser.save();
    }
    
    async getUser(id: bigint): Promise<User> {
        return await this.userModel.findById(id).exec();
    }
    
    async getUserAvatar(id: bigint): Promise<string> {
        var user = await this.userModel.findById(id).exec();
        if (!user)
            return "User Not Found";
        if (!user.avatar)
        {
            
        }
    }
    
    async deleteUserAvatar(id: bigint): Promise<any> {
        return await this.userModel.findByIdAndRemove(id).exec();
    }
}