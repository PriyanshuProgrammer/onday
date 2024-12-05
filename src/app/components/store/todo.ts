import {create} from 'zustand'

type todotype = {
    title:string,
    description:string,
    completed:boolean,
    settodo:(todo:string,description:string,completed:boolean) => void
}

const todostore = create<todotype>((set)=>({
    title:"",
    description:"",
    completed:false,
    settodo:(title,description,completed)=>{set({title:title,description:description,completed:completed})}
}))

export default todostore