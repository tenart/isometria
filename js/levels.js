function level1() {
    drawNCube(3, gridCoords(5,5,0), 1);
    updateArray(map3d, gridCoords(7,7,2), 101);
    updateArray(map3d, gridCoords(7,7,0), 103);
    drawIso();
}

level1();