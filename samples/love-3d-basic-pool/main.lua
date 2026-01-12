local sinuca3D = require('dist/3d')
local sinucaUtils = require('dist/utils')
local sinucaPhysics = require('dist/physics')
local sinucaLayouts = require('dist/layouts')

local worldW, worldH = sinucaLayouts.SConfig.getWorldSize()

local render = sinuca3D.newTranslatorIsometric3D(worldW, worldH)
local engine = sinucaPhysics.newSPhysicsLite(worldW, worldH)
    :add(sinucaLayouts.S8PoolGame())
    :listen('ball-colide-hole', function(ball)
        ball.active = false
    end)

local mouse = {
    ldown = false,
    rdown = false,
    lx = 0, ly = 0,
    rx = 0, ry = 0
}

local rotX = -0.8
local rotY = 0.0

function love.load()
    render:setViewPortCentered(0, 0, love.graphics.getDimensions())
    render:setScale(0.6)
    render:setDepthField(0)
    render:setRotate(0, 0, 0)
end

function love.update(dt)
    engine:step(dt)
end

function love.mousepressed(x, y, button)
    if button == 1 then
        mouse.ldown = true
        mouse.lx, mouse.ly = x, y
    elseif button == 2 then
        mouse.rdown = true
        mouse.rx, mouse.ry = x, y
    end
end

function love.mousereleased(x, y, button)
    if button == 1 and mouse.ldown then
        mouse.ldown = false
    elseif button == 2 then
        mouse.rdown = false
    end
end

function love.mousemoved(x, y, dx, dy)
    if mouse.rdown then
        rotY = rotY + dx * 0.01
        rotX = rotX + dy * 0.01
        render:setRotate(rotX, rotY, 0)
    end
end

function love.draw()
    love.graphics.setColor(0.1, 0.4, 0.1)
    love.graphics.polygon("fill", render:getQuadXY(0, 0, worldW, worldH))

    engine:iterator(function(obj, type, id)
        if not obj.r or not obj.active then return end

        local x, y = render:getXY(obj.x, obj.y, 0)
        local r = render:getR(obj.r)

        if type == 'hole' then
            love.graphics.setColor(0, 0, 0)
        elseif id == 0 then
            love.graphics.setColor(1, 1, 1)
        else
            love.graphics.setColor(1, 0, 0)
        end

        love.graphics.circle("fill", x, y, r)
    end)

    if mouse.ldown then
        local mx, my = love.mouse.getPosition()
        love.graphics.setColor(1, 1, 1)
        love.graphics.line(mouse.lx, mouse.ly, mx, my)
    end

    local xx1, xy1, yx1, yy1, zx1, zy1 = render:getAxisXY(worldW/2, worldH/2, 0, 500)
    local xx2, xy2, yx2, yy2, zx2, zy2 = render:getAxisXY(worldW/2, worldH/2, 0, -500)
    love.graphics.setColor(1,0,0)
    love.graphics.line(xx1, xy1, xx2, xy2)
    love.graphics.setColor(0,1,0)
    love.graphics.line(yx1, yy1,  yx2, yy2)
    love.graphics.setColor(0,0,1)
    love.graphics.line(zx1, zy1, zx2, zy2)
end
