"use client";

import { useEffect, useState } from "react";


export default function OrdersPage() {


  const [orders, setOrders] = useState([]);



  useEffect(() => {

    fetchOrders();

  }, []);




  async function fetchOrders(){


    try{


      const response = await fetch("/api/orders");


      const data = await response.json();


      setOrders(data.orders || []);



    }catch(error){

      console.log(error);

    }


  }




  if(orders.length === 0){

    return(

      <div className="text-center py-20 text-2xl font-semibold">

        No Orders Found

      </div>

    );

  }






  return(

    <div className="max-w-7xl mx-auto px-6 py-16">


      <h1 className="text-4xl font-bold mb-10">

        My Orders

      </h1>





      <div className="space-y-8">


        {orders.map((order)=>(



          <div

            key={order.id}

            className="border rounded-xl shadow p-6"

          >


            <div className="flex justify-between mb-5">


              <h2 className="text-xl font-bold">

                Order #{order.id}

              </h2>



              <span className="font-semibold">

                {order.status}

              </span>


            </div>





            <div className="space-y-4">


              {order.items.map((item)=>(


                <div

                  key={item.id}

                  className="flex items-center gap-5 border-b pb-4"

                >


                  <img

                    src={
                      item.product.image
                      ? `/images/${item.product.image}`
                      : "/images/no-image.png"
                    }

                    className="w-20 h-20 object-cover rounded"

                  />




                  <div>


                    <h3 className="font-bold">

                      {item.product.title}

                    </h3>


                    <p>

                      Qty: {item.quantity}

                    </p>



                    <p>

                      Price: Rs. {item.price}

                    </p>


                  </div>



                </div>


              ))}


            </div>





            <div className="text-right mt-5">


              <h2 className="text-2xl font-bold">

                Total: Rs. {order.totalPrice}

              </h2>


            </div>



          </div>


        ))}


      </div>


    </div>


  );

}