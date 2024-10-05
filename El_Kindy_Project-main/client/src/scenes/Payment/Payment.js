import React from "react";
import { useState } from "react";
import axios from "axios";

function Payment() {
  const [form,setForm] = useState({})
  const onchange = (e)=>{
    setForm({ 
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const onSubmit = (e)=>{
    e.preventDefault()
    axios
     .post('/payment/payment',form)
     .then(res=>{
        const {result} = res.data
        window.location.href = result.link;
     })
     .catch(err=>{
        console.log(err)
     })
  }
  return (
    <div>
      <form className="m-4" onSubmit={onSubmit}>
        <input type="text" name="amount" className="form-control" onChange={onchange}/>
        <button type="submit" className="btn btn-primary" mt-4>
          Pay
        </button>
      </form>
    </div>
  );
}

export default Payment;
