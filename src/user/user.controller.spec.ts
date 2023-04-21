import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {User} from './user.schema'
import {UserModule} from "./user.module";

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let user = new User();
    let userId;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Create User', () => {
        const newUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'password123',
            avatar: null
        };
        return request(app.getHttpServer())
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect((res) => {
                expect(res.body.firstName).toEqual(newUser.firstName);
                expect(res.body.lastName).toEqual(newUser.lastName);
                expect(res.body.email).toEqual(newUser.email);
                expect(res.body).toHaveProperty('_id');
                user = res.body;
                userId = res.body._id;
            });
    });

    it('Get Users', () => {
        return request(app.getHttpServer())
            .get('/api/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.toContainEqual(user))
            })
    });

    it('Get User', () => {
        return request(app.getHttpServer())
            .get(`/api/user/${userId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.users).toEqual(user);
            })
    });

    it('Get User avatar', () => {
        return request(app.getHttpServer())
            .get(`api/user/${userId}/avatar`)
            .expect(200);
    });

    it('Delete User avatar', () => {
        return request(app.getHttpServer())
            .delete(`api/user/${userId}/avatar`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id.toEqual(userId));
                expect(res.body.avatar.toBeNull());
            })
    });

});
