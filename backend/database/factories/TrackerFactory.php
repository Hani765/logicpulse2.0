<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tracker>
 */
class TrackerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => '40bcfd78-a7d9-4eb0-8fa6-4bb67a1546db',
            'unique_id' => Str::uuid()->toString(),
            "name" => $this->faker->words(3, true),
            "param" => $this->faker->words(3, true),
            "value" => $this->faker->words(3, true),
        ];
    }
}
