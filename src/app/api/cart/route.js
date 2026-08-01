import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";


// =======================
// ADD TO CART
// =======================
export async function POST(request) {

  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }


    const user = verifyToken(token);


    if (!user || user.role !== "BUYER") {
      return Response.json(
        { message: "Only Buyer can add to cart" },
        { status: 403 }
      );
    }


    const { productId, quantity } = await request.json();


    const product = await prisma.product.findUnique({
      where:{
        id:Number(productId)
      }
    });


    if(!product){

      return Response.json(
        {
          message:"Product not found"
        },
        {
          status:404
        }
      );

    }



    let cart = await prisma.cart.findUnique({

      where:{
        buyerId:user.id
      }

    });



    if(!cart){

      cart = await prisma.cart.create({

        data:{
          buyerId:user.id
        }

      });

    }




    const existingItem = await prisma.cartItem.findFirst({

      where:{
        cartId:cart.id,
        productId:Number(productId)
      }

    });




    if(existingItem){

      const item = await prisma.cartItem.update({

        where:{
          id:existingItem.id
        },

        data:{
          quantity:
          existingItem.quantity + (quantity || 1)
        }

      });


      return Response.json({

        message:"Cart updated successfully",

        item

      });


    }




    const item = await prisma.cartItem.create({

      data:{

        cartId:cart.id,

        productId:Number(productId),

        quantity:quantity || 1

      }

    });



    return Response.json(
      {
        message:"Product added to cart",
        item
      },
      {
        status:201
      }
    );



  }catch(error){

    return Response.json(
      {
        message:"Something went wrong",
        error:error.message
      },
      {
        status:500
      }
    );

  }

}





// =======================
// VIEW CART
// =======================

export async function GET(){


try{


const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;



if(!token){

return Response.json(
{
message:"Unauthorized"
},
{
status:401
}
);

}



const user = verifyToken(token);



if(!user || user.role !== "BUYER"){

return Response.json(
{
message:"Only Buyer can access cart"
},
{
status:403
}
);

}




const cart = await prisma.cart.findUnique({

where:{
buyerId:user.id
},


include:{

items:{

include:{

product:{

include:{

category:true,

seller:{
select:{
id:true,
name:true
}
}

}

}

}

}

}

});



return Response.json({

cart

});



}catch(error){

return Response.json(
{
message:"Something went wrong",
error:error.message
},
{
status:500
}
);

}


}







// =======================
// UPDATE QUANTITY
// =======================

export async function PUT(request){


try{


const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;



if(!token){

return Response.json(
{
message:"Unauthorized"
},
{
status:401
}
);

}



const user = verifyToken(token);



const {cartItemId, quantity} = await request.json();



if(quantity < 1){

return Response.json(
{
message:"Quantity must be at least 1"
},
{
status:400
}
);

}




const item = await prisma.cartItem.findUnique({

where:{
id:Number(cartItemId)
},

include:{
cart:true
}

});



if(!item){

return Response.json(
{
message:"Item not found"
},
{
status:404
}
);

}




if(item.cart.buyerId !== user.id){

return Response.json(
{
message:"Not allowed"
},
{
status:403
}
);

}




const updatedItem = await prisma.cartItem.update({

where:{
id:item.id
},

data:{
quantity:Number(quantity)
}

});



return Response.json({

message:"Quantity updated",

item:updatedItem

});




}catch(error){

return Response.json(
{
message:"Something went wrong",
error:error.message
},
{
status:500
}
);

}


}







// =======================
// REMOVE ITEM
// =======================

export async function DELETE(request){


try{


const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;



if(!token){

return Response.json(
{
message:"Unauthorized"
},
{
status:401
}
);

}



const user = verifyToken(token);



const {cartItemId} = await request.json();



const item = await prisma.cartItem.findUnique({

where:{
id:Number(cartItemId)
},

include:{
cart:true
}

});



if(!item){

return Response.json(
{
message:"Item not found"
},
{
status:404
}
);

}




if(item.cart.buyerId !== user.id){

return Response.json(
{
message:"Not allowed"
},
{
status:403
}
);

}




await prisma.cartItem.delete({

where:{
id:item.id
}

});



return Response.json({

message:"Item removed successfully"

});



}catch(error){


return Response.json(
{
message:"Something went wrong",
error:error.message
},
{
status:500
}
);


}


}