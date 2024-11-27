<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

class MetadataController extends Controller
{
    public function fetchMetadata(Request $request)
    {
        $url = $request->query('url');
        if (!$url) {
            return response()->json(['error' => 'URL is required'], 400);
        }

        try {
            $client = new Client();
            $response = $client->get($url);
            $html = $response->getBody()->getContents();

            $crawler = new Crawler($html);
            $metadata = [];

            // Basic fields
            $metadata['title'] = $crawler->filter('title')->count() ? $crawler->filter('title')->text() : 'No title found';
            $metadata['description'] = $crawler->filter('meta[name="description"]')->count() ? $crawler->filter('meta[name="description"]')->attr('content') : 'No description found';
            $metadata['image'] = $crawler->filter('meta[property="og:image"]')->count() ? $crawler->filter('meta[property="og:image"]')->attr('content') : 'No image found';

            // Additional meta fields
            $metadata['keywords'] = $crawler->filter('meta[name="keywords"]')->count() ? $crawler->filter('meta[name="keywords"]')->attr('content') : 'No keywords found';
            return response()->json($metadata);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch metadata', 'message' => $e->getMessage()], 500);
        }
    }
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
        ]);

        // Get the uploaded file
        $file = $request->file('image');

        // Define the path where the image will be saved
        $destinationPath = public_path('assets/images');

        // Generate a unique name for the image
        $imageName = time() . '_' . $file->getClientOriginalName();

        // Move the file to the assets/images directory
        $file->move($destinationPath, $imageName);

        // Return the path of the uploaded image
        return response()->json([
            'message' => 'Image uploaded successfully',
            'path' => '/assets/images/' . $imageName,
        ]);
    }

}
