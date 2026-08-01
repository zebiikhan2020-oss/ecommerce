"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {

  const router = useRouter();

  const [message, setMessage] = useState("Logging out...");


  useEffect(() => {


    async function handleLogout() {


      try {


        const response = await fetch("/api/auth/logout", {

          method: "POST",

        });



        const data = await response.json();



        if (response.ok) {

          setMessage(data.message);


          setTimeout(() => {

            router.push("/login");

          }, 1000);


        } else {

          setMessage("Logout failed");

        }



      } catch (error) {


        console.log(error);


        setMessage("Something went wrong");


      }


    }



    handleLogout();



  }, [router]);





  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">


      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 text-center">


        <h1 className="text-3xl font-bold mb-4">

          Logout

        </h1>



        <p className="text-gray-600">

          {message}

        </p>



      </div>


    </div>

  );

}