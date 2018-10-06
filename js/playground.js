// 1. Use updateArray() to update 3D array with an int value
// 2. Call drawIso() to draw using information from map3d
updateArray(map3d, gridCoords(0, 0, 0), 2);
updateArray(map3d, gridCoords(0, 0, 1), 2);
updateArray(map3d, gridCoords(0, 0, 2), 2);
//updateArray(map3d, gridCoords(0,7,0), 1);
//updateArray(map3d, gridCoords(7,0,0), 1);
//updateArray(map3d, gridCoords(7,7,0), 2);
drawIso();
drawCube(gridCoords(0, 0, 0), 3);