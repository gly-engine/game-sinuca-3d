local sinuca2D = require('dist/2d')
local sinucaUtils = require('dist/utils')
local sinucaPhysics = require('dist/physics')
local sinucaLayouts = require('dist/layouts')

local render = sinuca2D.newTranslator2D(sinucaLayouts.SConfig.getWorldSize())
local engine = sinucaPhysics.newSPhysicsLite(sinucaLayouts.S8PoolGame())

function love.load()
    render:setViewPort(0, 0, love.window.getMode())
end

function love.update(dt)
    engine:step(dt)
end

function love.draw()
    local width, height = love.window.getMode()

    love.graphics.setColor(0.1, 0.4, 0.1)
    love.graphics.rectangle("fill", 0, 0, width, height)

    engine:iterator(function(obj, type, id)
        if not obj.r then return end
        
        local x, y, r = render:getX(obj.x), render:getY(obj.y), render:getR(obj.r)
        
        if type == 'hole' then
            love.graphics.setColor(0, 0, 0)
        elseif id == 0 then
            love.graphics.setColor(1, 1, 1)
        else
            love.graphics.setColor(1, 0, 0)
        end
        love.graphics.circle("fill", x, y, r)
    end);

    if aiming then
        local cx, cy = sinucaUtils.getCueXY2D(engine, render)
        local mx, my = love.mouse.getPosition()
        love.graphics.setColor(1, 1, 1)
        love.graphics.line(cx, cy, mx, my)
    end
end

function love.mousepressed(x, y, button)
    if button == 1 then
        aiming = true
    end
end

function love.mousereleased(x, y, button)
    if button == 1 and aiming then
        aiming = false

        local cue = balls[1]
        local dx = cue.x - x
        local dy = cue.y - y
        physics:applyImpulse(0, dx * 3, dy * 3)
    end
end
