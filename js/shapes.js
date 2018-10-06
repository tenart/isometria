//nxnxn cube
function drawRect(n, position, materialID){
  for(i = 0; i < n; i++){
    for(j = 0; j < n; j++){
      for(k = 0; k < n; k++){
          updateArray(map3d, gridCoords(position.x + i, position.y + j, position.z + k), materialID)
      }
    }
  }

  drawIso()
}
