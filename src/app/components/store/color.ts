import {create} from 'zustand'

type colortype = {
    color:number[],
    setcolor:(color:number[])=>void
}

const colorstore = create<colortype>((set)=>({
    color:[],
    setcolor:(color)=>{set({color:color})}
}))

export default colorstore