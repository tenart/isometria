function level1() {
    
//    drawRect(gridCoords(16,16,1), gridCoords(0,0,0), 2);
    
    //drawRect(gridCoords(4,2,4), gridCoords(5,5,1), 1);
    
    drawRect(gridCoords(1,1,10), gridCoords(0,0,0), 1);
    drawRect(gridCoords(1,1,9), gridCoords(1,0,0), 1);
    drawRect(gridCoords(1,1,9), gridCoords(2,0,0), 1);
    drawRect(gridCoords(1,1,8), gridCoords(2,1,0), 1);
    drawRect(gridCoords(1,1,8), gridCoords(2,2,0), 1);
    updateArray(map3d, gridCoords(1,0,9), 101);
    updateArray(map3d, gridCoords(2,1,8), 102);
    
    drawIso();

    movePlayerTo(0,0,9);
    updatePlayer();
    
    playerSprite.y -= 12;
    
}

level1();