import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (
  email: string,
  password: string,
  referralCode?: string
) => {
  // 1. cek user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const generateReferral = Math.random().toString(36).substring(2, 8).toUpperCase();

  // 4. cari user yang punya referral code (kalau ada)
  let referredByUser = null;

  if (referralCode) {
    referredByUser = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referredByUser) {
      throw new Error("Invalid referral code");
    }
  }

  // 5. hitung expired (3 bulan)
  const now = new Date();
  const expiredDate = new Date();
  expiredDate.setMonth(now.getMonth() + 3);

  // 6. TRANSACTION 
  const result = await prisma.$transaction(async (tx) => {
    // create user
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        referralCode: generateReferral,
        referredById: referredByUser?.id,
      },
    });

    // kalau pakai referral
    if (referredByUser) {
      await tx.point.create({
        data: {
          userId: referredByUser.id,
          amount: 10000,
          expiresAt: expiredDate,
        },
      });

      await tx.coupon.create({
        data: {
          userId: user.id,
          discount: 10, // 10%
          expiresAt: expiredDate,
        },
      });
    }

    return user;
  });

  return {
    id: result.id,
    email: result.email,
    referralCode: result.referralCode,
  };
};

export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );


  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const getProfile = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};