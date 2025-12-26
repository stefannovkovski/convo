import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma:PrismaService){}

    findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({where:{email}});
    }

    findByUsername(username: string): Promise<User | null>{
        return this.prisma.user.findUnique({where:{username}});
    }

    createUser(data: {
        name: string;
        username: string;
        email: string;
        password: string;
    }): Promise<User> {
        return this.prisma.user.create({ data });
    }
}