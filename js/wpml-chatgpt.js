(function (wp) {
    const { registerPlugin } = wp.plugins;
    const { PluginSidebar } = wp.editPost;
    const { PanelBody, TextControl, Button } = wp.components;
    const { useState, createElement } = wp.element;

    console.log('ChatGPT Translate Plugin loaded');

    const ChatGPTTranslate = () => {
        console.log('Rendering ChatGPT Translate Sidebar');
        const [prompt, setPrompt] = useState('');
        const [translatedText, setTranslatedText] = useState('');

        const handleTranslate = async () => {
            console.log('Translating with prompt:', prompt);
            try {
                const response = await fetch('https://api.openai.com/v1/engines/gpt-4/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${wpmlChatgpt.apiKey}`
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        max_tokens: 1000
                    })
                });
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                const data = await response.json();
                console.log('Translation result:', data);
                if (data.choices && data.choices.length > 0) {
                    setTranslatedText(data.choices[0].text);
                } else {
                    throw new Error('No translation result returned');
                }
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedText('Error translating text');
            }
        };

        return createElement(
            PluginSidebar,
            {
                name: "wpml-chatgpt-sidebar",
                title: "ChatGPT Translate",
                icon: "translation"
            },
            createElement(
                PanelBody,
                { title: "Translate Content", initialOpen: true },
                createElement(TextControl, {
                    label: "Translation Prompt",
                    value: prompt,
                    onChange: (value) => {
                        console.log('Prompt changed:', value);
                        setPrompt(value);
                    }
                }),
                createElement(Button, {
                    isPrimary: true,
                    onClick: handleTranslate
                }, "Translate"),
                createElement(TextControl, {
                    label: "Translated Text",
                    value: translatedText,
                    onChange: (value) => {
                        console.log('Translated text changed:', value);
                        setTranslatedText(value);
                    }
                })
            )
        );
    };

    registerPlugin('wpml-chatgpt-translate', {
        render: ChatGPTTranslate,
        icon: 'translation'
    });

    console.log('Plugin registered');
})(window.wp);
