local sinuca3D = require("dist/3d")

local worldW, worldH, worldD = 400, 400, 400
local screenW, screenH = love.graphics.getWidth(), love.graphics.getHeight()
local render = sinuca3D.newTranslatorIsometric3D(worldW, worldH)

local cubeSize = 200
local cubeVertices = {}
for dx = 0, 1 do
    for dy = 0, 1 do
        for dz = 0, 1 do
            table.insert(cubeVertices, {
                x = (dx - 0.5) * cubeSize,
                y = (dy - 0.5) * cubeSize,
                z = (dz - 0.5) * cubeSize
            })
        end
    end
end

local edges = {
    {1,2},{1,3},{1,5},{2,4},{2,6},{3,4},{3,7},{4,8},
    {5,6},{5,7},{6,8},{7,8}
}


local fovArray = {0, 2000, 1000, 700, 600, 500, 400, 300, 250, 200}
local fovIndex = 1
local scale = 0.5

local angle = 0

function love.load()
    render:setViewPortCentered(0, 0, love.graphics.getDimensions())
    render:setDepthField(fovArray[fovIndex])
    render:setScale(scale)
    render:setPivot(0, 0, 0)
end

function love.update(dt)
    angle = angle + dt
    render:setRotate(angle, angle * 0.5, angle * 0.2)
end

function love.keypressed(key)
    if key == "right" then
        fovIndex = math.min(fovIndex + 1, #fovArray)
        render:setDepthField(fovArray[fovIndex])
    elseif key == "left" then
        fovIndex = math.max(fovIndex - 1, 1)
        render:setDepthField(fovArray[fovIndex])
    elseif key == "up" then
        scale = scale + 0.10
        render:setScale(scale)
    elseif key == "down" and scale > 0.20 then
        scale = scale - 0.10
        render:setScale(scale)
    end
end

function love.draw()
    love.graphics.setBackgroundColor(0.1,0.1,0.1)
    love.graphics.setColor(1,1,1)
    love.graphics.print("FOV: "..tostring(fovArray[fovIndex]), 8, 8)
    local screenVertices = {}
    for i, v in ipairs(cubeVertices) do
        local x, y = render:getXY(v.x, v.y, v.z)
        screenVertices[i] = {x=x, y=y}
    end
    for _, e in ipairs(edges) do
        local v1 = screenVertices[e[1]]
        local v2 = screenVertices[e[2]]
        love.graphics.line(v1.x, v1.y, v2.x, v2.y)
    end
end
