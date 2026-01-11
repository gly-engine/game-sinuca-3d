local physicsEngine = require('dist/physics')
local sinucaLayouts = require('dist/layouts')
local BALL_RADIUS = 10
local WIDTH, HEIGHT = 800, 400

local balls = {}
local aiming = false
local physics

local function newBall(x, y)
    return {
        x = x, y = y,
        vx = 0, vy = 0,
        r = BALL_RADIUS
    }
end

function love.load()
    love.window.setMode(WIDTH, HEIGHT)

    physics = physicsEngine.newSPhysicsLite()

    physics.world.width  = WIDTH
    physics.world.height = HEIGHT

    for ball, t in sinucaLayouts.S8PoolRack(WIDTH, HEIGHT) do
        table.insert(balls, ball)
    end

    physics.world.balls = balls
end

function love.update(dt)
    physics:step(dt)
end

function love.draw()
    love.graphics.setColor(0.1, 0.4, 0.1)
    love.graphics.rectangle("fill", 0, 0, WIDTH, HEIGHT)

    for i, b in ipairs(balls) do
        if i == 1 then
            love.graphics.setColor(1, 1, 1)
        else
            love.graphics.setColor(1, 0, 0)
        end
        love.graphics.circle("fill", b.x, b.y, b.r)
    end

    if aiming then
        local mx, my = love.mouse.getPosition()
        local cue = balls[1]
        love.graphics.setColor(1, 1, 1)
        love.graphics.line(cue.x, cue.y, mx, my)
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
