import * as THREE from './assets/three.module.js';
// Screen direction of geographic north for a camera looking down the Z axis.
export function northDirection(quaternion){
 const north=new THREE.Vector3(0,1,0).applyQuaternion(quaternion);
 return {angle:Math.atan2(north.x,north.y),defined:Math.hypot(north.x,north.y)>0.0001};
}
export function northUpQuaternion(quaternion){
 const direction=northDirection(quaternion);
 return direction.defined?new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),direction.angle).multiply(quaternion):quaternion.clone();
}
export function createCompass(parent,getQuaternion,setQuaternion,isVisible=()=>true){
 const button=document.createElement('button');button.type='button';button.className='earth-compass';
 button.innerHTML='<span class="compass-dial" aria-hidden="true"><span class="compass-n">N</span><span class="compass-e">E</span><span class="compass-s">S</span><span class="compass-w">W</span><span class="compass-needle"></span></span><span class="compass-pole" aria-hidden="true">POLE</span>';
 button.title='Geographic north · Click to reset north-up';button.setAttribute('aria-label','Compass: reset globe north-up');parent.append(button);
 const dial=button.querySelector('.compass-dial');
 button.onclick=()=>{const q=getQuaternion();if(northDirection(q).defined)setQuaternion(northUpQuaternion(q));};
 return {update(){button.hidden=!isVisible();if(button.hidden)return;const direction=northDirection(getQuaternion());dial.style.transform=`rotate(${direction.angle*180/Math.PI}deg)`;button.classList.toggle('at-pole',!direction.defined);button.disabled=!direction.defined;},button};
}
