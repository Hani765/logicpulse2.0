<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Domain;
use App\Models\Network;
use Illuminate\Support\Str;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Offers>
 */
class OffersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        // Ensure you have at least one user in the database to reference
        $user = User::inRandomOrder()->first();
        $networkId = Network::inRandomOrder()->value('unique_id');
        $domainId = Domain::inRandomOrder()->value('unique_id');
        $domainId = Category::inRandomOrder()->value('unique_id');

        return [
            'user_id' => 'f8bd895b-5526-4370-80bb-66b1a8623872',
            'unique_id' => Str::uuid()->toString(),
            'title' => $this->faker->words(3, true),
            'network_id' => $networkId,
            'domain_id' => $domainId,
            'category_id' => $domainId,
            'age' => $this->faker->numberBetween(18, 65),
            'rate' => $this->faker->randomFloat(2, 0, 100),
            'encryption' => $this->faker->word,
            'urls' => $this->faker->url,
            'image' => $this->faker->url,
            'description' => $this->faker->paragraph,
            'countries' => $this->faker->country,
            'proxy' => $this->faker->word,
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
