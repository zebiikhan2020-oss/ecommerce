import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const buyer = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!buyer || buyer.role !== "BUYER") {
      return NextResponse.json(
        { message: "Only buyers can start conversations" },
        { status: 403 }
      );
    }

    // Frontend sirf productId bhejega
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product is required" },
        { status: 400 }
      );
    }

    // Database se product nikaalo
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        seller: true,
      },
    });
    console.log(product);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Product ka actual seller
    const sellerId = product.sellerId;
    const isAdminProduct = product.seller?.role === "ADMIN";
    // Buyer apne hi product par chat na kare
    if (buyer.id === sellerId) {
      return NextResponse.json(
        { message: "You cannot message yourself." },
        { status: 400 }
      );
    }

    // Existing conversation check
    const existingConversation = await prisma.conversation.findFirst({
  where: {
    buyerId: buyer.id,
    productId,

    ...(isAdminProduct
      ? {
          adminId: sellerId,
        }
      : {
          sellerId,
        }),
  },
});

    if (existingConversation) {
      return NextResponse.json({
        conversation: existingConversation,
      });
    }

    // New conversation
   const conversation = await prisma.conversation.create({
  data: {
    buyerId: buyer.id,
    productId,

    ...(isAdminProduct
      ? {
          adminId: sellerId,
        }
      : {
          sellerId,
        }),
  },
});

    return NextResponse.json({
      message: "Conversation created successfully",
      conversation,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let conversations = [];
    let unreadCount = 0;
    if (user.role === "BUYER") {
      conversations = await prisma.conversation.findMany({
        where: {
          buyerId: user.id,
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              isOnline: true,
              lastSeen: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              role: true,
              isOnline: true,
              lastSeen: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              image: true,
              price: true,
            },
          },

          admin: {
  select: {
    id: true,
    name: true,
    role: true,
    isOnline: true,
    lastSeen: true,
  },
},

          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

     unreadCount = await prisma.message.count({
  where: {
    conversation: {
      buyerId: user.id,
    },
    senderId: {
      not: user.id,
    },
    isRead: false,
  },
});


   } else {

  conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        {
          sellerId: user.id,
        },
        {
          adminId: user.id,
        },
      ],
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          isOnline: true,
          lastSeen: true,
        },
      },
      seller: {
        select: {
          id: true,
          name: true,
          role: true,
          isOnline: true,
          lastSeen: true,
        },
      },

      admin: {
  select: {
    id: true,
    name: true,
    role: true,
    isOnline: true,
    lastSeen: true,
  },
},

      product: {
        select: {
          id: true,
          title: true,
          image: true,
          price: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  unreadCount = await prisma.message.count({
    where: {
      conversation: {
        OR: [
          {
            sellerId: user.id,
          },
          {
            adminId: user.id,
          },
        ],
      },
      senderId: {
        not: user.id,
      },
      isRead: false,
    },
  });

}

   

   return NextResponse.json({
  conversations,
  unreadCount,
  currentUserId: user.id,
});

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}