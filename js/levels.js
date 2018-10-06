function level1() {
    drawNCube(4, gridCoords(5,5,0), 1);
    updateArray(map3d, gridCoords(8,8,3), 0);
    updateArray(map3d, gridCoords(7,8,3), 101);
    updateArray(map3d, gridCoords(8,7,3), 102);
    updateArray(map3d, gridCoords(8,8,0), 0);
    updateArray(map3d, gridCoords(7,8,0), 103);
    updateArray(map3d, gridCoords(8,7,0), 103);
    drawIso();
}

level1();