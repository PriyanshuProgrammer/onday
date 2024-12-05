import {create} from 'zustand'

type viewtype = {
    view:string,
    setview:(view:string)=>void
}

const viewstore = create<viewtype>((set)=>({
    view:"todo",
    setview:(viewval)=>{set({view:viewval})}
}))

export default viewstore