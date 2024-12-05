import {create} from 'zustand'

type todoobject = {
    title:string,
    description:string
    completed:boolean
}

type todosstype = {
    todos:todoobject[],
    id:number,
    settodos:(todos:todoobject[],id:number)=>void
}

const todosstore = create<todosstype>((set)=>({
    todos:[],
    id:0,
    settodos:(todos,id)=> {
        localStorage.removeItem(id.toString())
        set({todos:todos,id:id})
        if(todos.length)
            localStorage.setItem(id.toString(),JSON.stringify(todos))
    }
}))

export default todosstore