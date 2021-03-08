import React from "react";
import { hot } from 'react-hot-loader/root';

function Credits(){
    return(
        <div>
            <div>Photo by <a href="https://unsplash.com/@nasa?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">NASA</a> on <a href="https://unsplash.com/s/photos/saturn?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></div>
            <div>Photo by <a href="https://unsplash.com/@npigossi?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Nelson Pigossi Jr</a> on <a href="https://unsplash.com/s/photos/milk-way?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></div>
        </div>
    )
}
export default hot(Credits);