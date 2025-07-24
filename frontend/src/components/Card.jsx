import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Cards(props){
    return(
        <Card className="h-40 w-full m-2 rounded-lg shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card transition-colors">
        <CardHeader>
          <CardTitle>{props.dis}</CardTitle>
        </CardHeader>
        <CardContent>
          {
              (props.dis==='Trades')?(
                <div>
                  <p>Total trades: {props.content}</p>
                  <p>Total trades: {props.win}</p>
                </div>
              ):(
                <p>{props.dis} : {props.content}</p>
              )
          }
        </CardContent>
      </Card>
    )
};