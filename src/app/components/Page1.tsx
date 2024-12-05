"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from 'zustand'
import viewstore from './store/viewstore'
import colorstore from './store/color'
import todostore from './store/todo'
import todosstore from './store/todos'
import { RiAddLine, RiCheckLine, RiCircleLine } from '@remixicon/react'

const Page1 = () => {

    // Zustand for state Management as given in the assignment
    const {color,setcolor} = colorstore()
    const {view, setview} = viewstore()
    const {title, description,completed, settodo} = todostore()
    const {todos, id, settodos} = todosstore()

    // usestate hooks
    const [pageid, setpageid] = useState(new Date().getDate())
    const [editid, seteditid] = useState(0)

    // to load the todos from the local storage
    useEffect(function(){
        let todostring:string | null = localStorage.getItem(`${pageid}`)
        let todoarray:{title:string,description:string,completed:boolean}[] =[];
        if(todostring){
            todoarray = JSON.parse(todostring)
            settodos(todoarray,pageid)
        }else{
            settodos([],pageid)
        }    
    },[pageid])

    // to set the dates on the top nav
    let datearr = useMemo(function(){
        let arr = []
        let colorarr = []
        let days = ['S','M','T','W','T','F','S']
        let currentday = new Date().getDay()
        let currentdate = new Date().getDate()
        function getdate(date:number):number{
            if(date<0)
                date = 32-date
            return date
        }
        for(let i = 0 ; i<7; i++){
            arr[i] = {date:getdate(currentdate-currentday+i), day:days[i]}

            // to set the color of each date either white or black(if current date)
            if(i == currentday) 
                colorarr[i] = 1
            else{
                colorarr[i] = 0
            }
        }
        setcolor(colorarr)
        return arr
    },[new Date().getDate()])

    // runs when you click on the day nav at the top
    function getcolor(event:React.MouseEvent<HTMLButtonElement>){
        let arr = []
        let id =  parseInt(event.currentTarget.id)
        let currentdate = new Date().getDate();
        let currentday = new Date().getDay();
        setpageid((currentdate-(currentday-id)))
        for(let i = 0; i<7; i++){
            if(i == id ){
                arr[i] = 1
            }else{
                arr[i] = 0
            }
        }
        setcolor(arr)
    }

    // to delete the todo
    function deletetodo(index:number){
        let arr:{title:string,description:string,completed:boolean}[] = todos.filter((todo,idx)=>{
            return idx != index
        })
        settodos(arr,pageid)
    }

    // to edit the todo 
    function edittodo(index:number){
        let arr:{title:string,description:string,completed:boolean}[] = todos.map((todo,idx)=>{
            let todoobj = todo
            if(idx == index){
                todoobj.title = title
                todoobj.description = description
                todoobj.completed = false
            }
            return todoobj
        })
        settodos(arr,pageid)
    }

    // toggle the completion of todos
    function togglecompleted(index:number){
        let todoarr = todos.map((todo,idx)=>{
            let todoobj = todo
            if(idx == index){
                todoobj.completed = !todoobj.completed
            }
            return todoobj
        })
        settodos(todoarr,pageid)
    }


    return (
        <div className="w-full h-screen bg-slate-50 grid place-content-center">
            
            {/* loads the dates on the top nav */}
            <div className="w-[100vw] md:w-[80vw] lg:w-[60vw] h-[90vh] bg-slate-50 flex-col rounded-xl flex shadow-xl">
                <div className="m-5 font-bold text-2xl">onday</div>
                    <div className="w-[100%] h-auto bg-white shadow-xl mr-auto ml-auto rounded-xl flex justify-evenly p-5 pt-0 overflow-hidden">
                        {
                            // render all the button componenets for date with fontcolor and background color
                            datearr.map(function(el,index){
                                let bgcolor = "bg-white";
                                let fontcolor = "text-black";
                                if(color[index] == 1){
                                    bgcolor = "bg-black"
                                    fontcolor = "text-white"
                                }
                                if(index > new Date().getDay()){
                                    fontcolor = "text-gray-500"
                                }
                                return <DateComponent key={index} id={index} day={el.day} date={el.date} getcolor={getcolor} color={bgcolor} fontcolor={fontcolor} ></DateComponent>
                            })
                        }
                    </div>

                {/* loads the todos in the app */}
                <div className='h-auto overflow-y-scroll overflow-x-hidden mt-5'>
                    {
                        view == 'todo' &&
                        todos.map(function(el:{title:string,description:string,completed:boolean},index){
                            let icon = <RiCheckLine></RiCheckLine>

                            // to show icons respectively on completion and incompletion of the todo
                            if(!el.completed)
                                icon = <RiCircleLine></RiCircleLine>

                            return <div key={index}>
                                <div className='p-8 pt-4 pb-4 bg-slate-50 shadow-lg rounded-xl flex mb-5 justify-between'>
                                    <div className='flex gap-3 items-center'>
                                        <button onClick={()=>{togglecompleted(index)}}>{icon}</button>
                                        <div>
                                            <div className='text-xl font-bold' >{el.title}</div>
                                            <div>{el.description}</div>
                                        </div>

                                    </div>

                                    <div className='flex items-center'>
                                        <button className='text-white bg-slate-950 rounded-xl p-1 pl-2 pr-2' onClick={()=>{deletetodo(index)}}>Delete</button>
                                        <button  className='rounded-xl p-1 pl-2 pr-2 font-bold' onClick={()=>{
                                            setview("edittodo")
                                            seteditid(index)
                                            settodo(el.title, el.description, el.completed)
                                        }}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                        })
                    }
                </div>

                {/* view the todo section */}
                {
                    view == 'todo' &&
                    <div className='mt-auto flex justify-center p-5'>
                        <button className='shadow-lg shadow-slate-500 rounded-full w-[50px] h-[50px] grid place-content-center' onClick={()=>{setview("addtodo")}}>
                        <RiAddLine size={25}></RiAddLine>
                        </button>
                    </div>
                }

                {/* view the add todo section */}
                {
                    view == 'addtodo' &&    
                    <>
                    
                    <div className='w-[100%] flex justify-center items-center pt-10 gap-5'>
                        <div className='flex flex-col gap-5'>
                            <div className='text-sm md:text-xl'>Title:</div>
                            <div className='text-sm md:text-xl'>Description:</div>    
                        </div>
                        <div className='flex flex-col gap-5' >
                            <input type="text" className='text-sm md:text-xl  shadow-lg shadow-slate-300 rounded-lg p-2 pt-1 pb-1' onChange={(el)=>{settodo(el.target.value,description,false)}} placeholder='Enter the title...' />
                            <input type="text" className='text-sm md:text-xl shadow-lg shadow-slate-300 rounded-lg p-2 pt-1 pb-1' onChange={(el)=>{settodo(title,el.target.value,false)}} placeholder='Enter the Description...' />
                        </div>
                    </div>  
                        
                        <div className='flex gap-5 justify-center mt-5'>
                            <button className='bg-slate-950 text-white text-xl p-5 pt-1 pb-1 rounded-full' onClick={()=>{
                                setview("todo")
                                settodos([...todos,{title:title,description:description,completed:false}],pageid)
                                }}>Add</button>

                            <button className='text-xl p-5 pt-1 pb-1 rounded-full border-2 border-slate-950 ' onClick={()=>{setview("todo")}}>Cancel</button>
                        </div>

                        </>

                }

                {
                    
                    
                    
                    view == 'edittodo' &&
                    <>
                    
                    <div className='w-[100%] flex  justify-center items-center pt-10 gap-5'>
                        <div className='flex flex-col gap-5'>
                            <div className='text-sm md:text-xl'>Title:</div>
                            <div className='text-sm md:text-xl'>Description:</div>    
                        </div>
                        <div className='flex flex-col gap-5' >
                            <input type="text" value={title} className='text-sm md:text-xl  shadow-lg shadow-slate-300 rounded-lg p-2 pt-1 pb-1' onChange={(el)=>{settodo(el.target.value,description,completed)}} placeholder='Enter the title...' />
                            <input type="text" value={description}  className='text-sm md:text-xl shadow-lg shadow-slate-300 rounded-lg p-2 pt-1 pb-1' onChange={(el)=>{settodo(title,el.target.value,completed)}} placeholder='Enter the Description...' />
                        </div>
                    </div>  
                        
                        <div className='flex gap-5 justify-center mt-5'>
                            <button className='bg-slate-950 text-white text-xl p-5 pt-1 pb-1 rounded-full' onClick={()=>{
                                setview("todo")
                                edittodo(editid)
                                }}>Edit</button>

                            <button className='text-xl p-5 pt-1 pb-1 rounded-full border-2 border-slate-950 ' onClick={()=>{setview("todo")}}>Cancel</button>
                        </div>

                        </>
                }

            </div>  

    
        </div>
    )
}

type Date = {
    day:string
    date:number,   
    fontcolor:string,
    color:string,
    id:number,
    getcolor:(event:React.MouseEvent<HTMLButtonElement>)=>void
}

// component for the date options on the top with customize able color and font color
function DateComponent({day,date,fontcolor,color,id,getcolor}:Date){

    return (
        <button onClick={getcolor} id = {`${id}`} className={`h-16 w-10 ${color}  rounded-xl flex-col flex items-center justify-center`}>
            <div className={`${fontcolor} font-bold`}>{day}</div>
            <div className={`${fontcolor} font-bold`}>{date}</div>
        </button>
    )
}

export default Page1
