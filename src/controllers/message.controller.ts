import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import status from "http-status";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;

    const senderID = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderID, receiverId],
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderID, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderID,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    res.status(status.CREATED).json(newMessage);
  } catch (error: any) {
    console.log("Error in sendMessage controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderID = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderID, userToChatId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.status(status.OK).json([]);
    }

    return res.status(status.OK).json(conversation.messages);
  } catch (error: any) {
    console.log("Error in getMessages controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: {
        id: true,
        fullName: true,
        profilePic: true,
      },
    });

    res.status(status.OK).json(users);
  } catch (error: any) {
    console.log("Error in getUsersForSidebar controller", error.message);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
