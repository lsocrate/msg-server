import { prisma } from "../prisma.js";

export const createMessage = async (params: {
  content: string;
  recipient: string;
}) => {
  const newMessage = await prisma.message.create({
    data: {
      content: params.content,
      recipient: params.recipient,
    },
  });

  return newMessage;
};
