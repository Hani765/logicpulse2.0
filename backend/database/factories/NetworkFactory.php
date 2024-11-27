<?php

namespace Database\Factories;

use App\Models\Tracker;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Network>
 */
class NetworkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $trackerId = Tracker::inRandomOrder()->value('unique_id');
        return [
            'user_id' => '40bcfd78-a7d9-4eb0-8fa6-4bb67a1546db',
            'unique_id' => Str::uuid()->toString(),
            'tracker_id' => $trackerId,
            "name" => $this->faker->words(3, true)
        ];
    }
}
