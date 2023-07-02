import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/utils/db";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    await connect();

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return NextResponse.json({
        message: "E-mail já cadastrado!",
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({
      message: "Usuário criado com sucesso!",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Erro ao cadastrar usuário",
      status: 500,
    });
  }
}
