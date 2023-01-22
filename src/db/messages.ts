import { prisma } from "../prisma.js";

const markAsFetched = async (ids: number[]) => {
  await prisma.message.updateMany({
    data: { fetchedAt: new Date() },
    where: { id: { in: ids } },
  });
};

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

export const deleteMessages = async (ids: number[]) => {
  await prisma.message.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

export const fetchUnreadMessages = async () => {
  const messages = await prisma.message.findMany({
    where: { fetchedAt: { equals: null } },
  });
  await markAsFetched(messages.map((msg) => msg.id));
  return messages;
};

export const fetchPaginated = async (start: number, stop: number) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
    skip: start,
    take: stop - start,
  });
  await markAsFetched(messages.map((msg) => msg.id));
  return messages;
};
