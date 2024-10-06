import { Server } from 'http';
import app from './app';
import express from 'express'
const port  = 3000;

async function main(){
    const server  : Server= app.listen(port,()=>{
        console.log('server runnig on port ', port)
    })
}
main()