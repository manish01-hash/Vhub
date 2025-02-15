import { useEffect, useState } from 'react';
import './App.css';
import CreateVolunteer from './components/CreateVolunteer';
import DeleteVolunteer from './components/DeleteVolunteer';
import UpdateVolunteer from './components/UpdateVolunteer';
import ViewAll from './components/ViewAll';


function App() {
  const [add, setAdd] = useState(true);
  const [delete1, setDelete] = useState(null);
  const [all, setAll] = useState(null);
  const [update, setUpdate] = useState(null);
  
 function handleAdd(){
   setAdd(true);
   setDelete(false);
   setAll(false);
   setUpdate(false);
 }
 function handleDelete(){
   setDelete(true);
   setAdd(false);
   setAll(false);
   setUpdate(false);
 }

 function handleAll(){
  setAll(true);
  setAdd(false);
  setDelete(false);
  setUpdate(false);
}

function handleUpdate(){
  setUpdate(true);
  setAdd(false);
  setDelete(false);
  setAll(false);
}
  

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col 	bg-gray-900">
      <div className="w-full h-[10%]  flex justify-center gap-4 items-center bg-gray-700">
          <button className="w-[10%] bg-green-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleAdd}>Add</button>
          <button className="w-[10%] bg-red-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleDelete}>Delete</button>
          
          <button className="w-[10%] bg-orange-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleUpdate}>Update</button>
          <button className="w-[10%] bg-blue-400 h-[80%] rounded-md text-xl font-bold"
          onClick={handleAll}>View All</button>

      </div>
      
      {
        add && <CreateVolunteer/>
      }
      {
        delete1 && <DeleteVolunteer/>
      }
      {
        all && <ViewAll/>
      }
      {
        update && <UpdateVolunteer/>
      }
      
     
    </div>
  );
}

export default App;