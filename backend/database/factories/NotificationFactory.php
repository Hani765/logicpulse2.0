<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Notification;
use App\Models\User;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $sender = User::inRandomOrder()->first(); // Random sender user
        $userIds = User::inRandomOrder()->limit(rand(1, 5))->pluck('unique_id')->toArray(); // Random user IDs

        return [
            'type' => $this->faker->randomElement(['info', 'warning', 'success', 'error']),
            'data' => json_encode(['message' => $this->faker->sentence]),
            'user_ids' => implode(',', $userIds),
            'username' => $this->faker->username,
            'sender_id' => $sender ? $sender->unique_id : null,
            'read_at' => $this->faker->boolean ? $this->faker->dateTime : null,
        ];
    }
}
