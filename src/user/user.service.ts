import {Model, ObjectId} from 'mongoose'
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.schema";
import {Injectable} from "@nestjs/common";

const fs = require('fs');
const path = require('path');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) 
    private userModel: Model<UserDocument>) {
    }
    
    async createUser(user: User): Promise<any> {
        const newUser = new this.userModel(user);
        await this.sendMessage(user);
        
        // this is in try catch because it's just a dummy email
        try {
            await this.sendEmail(user);
        }
        catch (err){
            console.log(err)
        }
        return newUser.save();
    }
    
    async getAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }
    async getUser(id): Promise<User> {
        return await this.userModel.findById(id).exec();
    }
    
    async getUserAvatar(id: ObjectId): Promise<string> {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            return "User Not Found";
        if (!user.avatar)
        {
            const mainPath = path.resolve(__dirname, '..\\..\\');
            const imageEncoded = await fs.readFileSync(path.join(mainPath, 'dummy-profile-pic.jpg'));
            const pathToFile = path.join(mainPath, 'avatars', `${id}.jpg`);
            await fs.writeFile(pathToFile, imageEncoded, (err) => {
                if (err) console.log(err);
            });
            user.avatar = (pathToFile);
            await this.userModel.findByIdAndUpdate(id, user, {new: true});
        }
        return fs.readFileSync(user.avatar);
    }
    
    async deleteUserAvatar(id: ObjectId): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        await fs.unlink(user.avatar, (err) =>{
            if (err)
                console.log(err)
        });
        user.avatar = null;
        await this.userModel.findByIdAndUpdate(id, user, {new: true})
        return user;
    }


    async sendMessage(user) {

        const connection = await amqp.connect('amqp://localhost');

        const channel = await connection.createChannel();

        const queueName = 'dummy_queue';
        await channel.assertQueue(queueName);

        const message = `user added: ${user}`;

        channel.sendToQueue(queueName, Buffer.from(message));

        await channel.close();
        await connection.close();
    }

    private async sendEmail(user: User) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'dummy_email@gmail.com',
                pass: 'dummy_password',
            },
        });

        const mailOptions = {
            from: 'dummy_email@gmail.com',
            to: user.email,
            subject: 'Dummy email',
            text: 'This is a dummy email.',
            html: '<p>This is a dummy email.</p>',
        };

        await transporter.sendMail(mailOptions);
    }
}