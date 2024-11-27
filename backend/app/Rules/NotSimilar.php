<?php
namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class NotSimilar implements Rule
{
    protected $username;
    protected $email;

    public function __construct($username, $email)
    {
        $this->username = $username;
        $this->email = $email;
    }

    public function passes($attribute, $value)
    {
        return !str_contains($value, $this->username) &&
            !str_contains($value, $this->email) &&
            !str_contains($value, '@' . $this->email);
    }

    public function message()
    {
        return 'The :attribute cannot be similar to your username or email.';
    }
}
