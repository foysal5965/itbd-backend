import { UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import prisma from "./app/shared/prisma";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }
        });

        if (isExistSuperAdmin) {
            return;
        };

        const hashedPassword = await bcrypt.hash("123456", 12)

        const superAdminData = await prisma.user.create({
            data: {
                email: "super@admin.com",
                password: hashedPassword,
                role: UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "Super Admin",
                        //email: "super@admin.com",
                        contactNumber: "01234567890"
                    }
                }
            }
        });
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect();
    }
};

seedSuperAdmin();