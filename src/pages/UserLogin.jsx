import React, {useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './UserLogin.css';

export default function UserLogin(){
  const [form,setForm]=useState({name:'',password:''})
  const [msg,setMsg]=useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const res = await axios.post('http://localhost:9090/api/users/login', form)
      if(res.data && res.data.status==='success'){
        setMsg('Login successful')
        setTimeout(()=>nav('/home'),800)
      } else {
        setMsg(res.data.message||'Login failed')
      }
    }catch(err){
      setMsg(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="form-page">
      <div className="card">
        <h2>User Login</h2>
        <form onSubmit={submit}>
          <input className="input" placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input className="input" type="password" placeholder="Password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <button className="submit" type="submit">Login</button>
        </form>
        <div className="message">{msg}</div>
        <Link className="link" to="/register">Don't have account? Register</Link>
      </div>
    </div>
  )
}
