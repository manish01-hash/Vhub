import React from "react";

function Volunteer({id,name,status,gender,age,phone}){
    return(
        <tr key={id} className="text-white bg-gray-700 items-center border border-b-gray-800">
    <td className="p-3">{name}</td>
    <td className="p-3">{phone}</td>
    <td className="p-3">{gender}</td>
    <td className="p-3">{age}</td>
    <td className="p-3">{status ? "Active" : "Inactive"}</td>
</tr>

    )
}

export default Volunteer;