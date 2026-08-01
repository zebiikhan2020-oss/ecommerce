"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";


export default function ResetPasswordPage() {


  const searchParams = useSearchParams();

  const router = useRouter();


  const token = searchParams.get("token");



  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);





  async function handleSubmit(e) {

    e.preventDefault();


    if (password !== confirmPassword) {

      setMessage("Passwords do not match");

      return;

    }



    setLoading(true);

    setMessage("");



    try {


      const response = await fetch("/api/auth/reset-password", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          token,

          password,

        }),

      });



      const data = await response.json();



      setMessage(data.message);



      if(response.ok){

        setTimeout(()=>{

          router.push("/login");

        },2000);

      }



    } catch(error){


      console.log(error);

      setMessage("Something went wrong");


    } finally {


      setLoading(false);


    }


  }





  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">


      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">


        <h1 className="text-3xl font-bold text-center mb-2">

          Reset Password

        </h1>



        <p className="text-center text-gray-500 mb-8">

          Create your new password

        </p>





        {
          message && (

            <div className="mb-5 text-center text-sm text-blue-600">

              {message}

            </div>

          )
        }





        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >




          <input

            type="password"

            placeholder="New Password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"

            required

          />





          <input

            type="password"

            placeholder="Confirm New Password"

            value={confirmPassword}

            onChange={(e)=>setConfirmPassword(e.target.value)}

            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"

            required

          />





          <button

            type="submit"

            disabled={loading}

            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"

          >

            {
              loading
              ? "Resetting..."
              : "Reset Password"
            }


          </button>




        </form>





        <p className="text-center mt-6">


          Remember password?{" "}


          <Link

            href="/login"

            className="text-blue-600 font-semibold"

          >

            Login

          </Link>


        </p>




      </div>


    </div>

  );

}