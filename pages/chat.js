import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';
import { Popover } from '../src/components/Popover';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNjMzNiwiZXhwIjoxOTU4OTAyMzM2fQ.tK2fxCVOekMwq6B60aJua7P_3iysP7sSzCNictqQdQM';
const SUPABASE_URL = 'https://uqwldfjhnpcxgbbnxvpt.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
    const routing = useRouter();
    const loggedUser = routing.query.username;
    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]);
    const [enterSends, setEnterSend] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessagesList(data);
                setLoading(false);
            })
    }, []);

    const sendMessage = ((newMessage) => {
        if (newMessage.length) {
            setLoading(true);
            const _message = {
                from: loggedUser,
                text: newMessage,
            }

            supabaseClient.from('messages')
                .insert(_message)
                .then(({ data }) => {
                    setMessagesList([data[0], ...messagesList]);
                    setLoading(false);
                });
            setMessage('');
        }
    });

    const deleteMessage = ((messageId) => {
        setLoading(true);
        supabaseClient.from('messages')
            .delete()
            .match({ id: messageId })
            .then(() => {
                const _messagesList = messagesList.filter(message => message.id != messageId);
                setMessagesList([..._messagesList]);
                setLoading(false);
            });
    });

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://wallpaper.dog/large/514209.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.primary[100]
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.primary[500],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />

                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.primary[200],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                        justifyContent: 'flex-end',
                    }}
                >
                    {loading && (
                        <Box
                            styleSheet={{
                                position: 'relative',
                                zIndex: 1000,
                                height: '100%',
                                backgroundImage: 'url(https://c.tenor.com/mbb_vsQMsVoAAAAC/gryffindor-harrypotter.gif)',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'block',
                                borderRadius: '5px',
                            }}
                        ></Box>)}
                    <MessageList messages={messagesList} deleteMessage={(messageId) => deleteMessage(messageId)} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignContent: 'flex-end',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => { setMessage(event.target.value) }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter' && enterSends) {
                                    event.preventDefault();
                                    sendMessage(message);
                                }
                            }}
                            placeholder="Your message here..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.primary[100],
                                marginRight: '12px',
                                color: appConfig.theme.colors.primary[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                sendMessage(`:sticker: ${sticker}`)
                            }}
                        />
                        <Button
                            styleSheet={{
                                marginLeft: '7px',
                                height: '44px',
                                borderRadius: '5px',
                                backgroundColor: appConfig.theme.colors.primary[300],
                                color: appConfig.theme.colors.primary[200],
                            }}
                            disabled={!message.length}
                            label='OK'
                            onClick={() => sendMessage(message)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{
                width: '100%',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const handleDelete = ((messageId) => {
        if (props.deleteMessage) props.deleteMessage(messageId);
    });

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.primary[100],
                marginBottom: '16px',
            }}
        >
            {props.messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.primary[200],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div className="info">
                                <Popover message={message}>
                                    <Image
                                        styleSheet={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'inline-block',
                                            marginRight: '8px',
                                        }}
                                        alt=""
                                        src={`https://github.com/${message.from}.png`}
                                    />
                                    <Text
                                        tag="strong"
                                        styleSheet={{
                                            color: appConfig.theme.colors.primary[100],
                                        }}>
                                        {message.from}
                                    </Text>
                                    <Text
                                        styleSheet={{
                                            fontSize: '10px',
                                            marginLeft: '8px',
                                            color: appConfig.theme.colors.primary[300],
                                        }}
                                        tag="span"
                                    >
                                        {message.created_at || (new Date().toLocaleDateString())}
                                    </Text>
                                </Popover>
                            </div>
                            <div>
                                <Button
                                    styleSheet={{
                                        backgroundColor: 'transparent',
                                        focus: {
                                            backgroundColor: '',
                                        },
                                        hover: {
                                            backgroundColor: '',
                                        }
                                    }}
                                    iconName="trash"
                                    size="xs"
                                    onClick={() => handleDelete(message.id)}
                                />
                            </div>
                        </Box>
                        {message.text.startsWith(':sticker:') ?
                            (
                                <Image
                                    styleSheet={{
                                        maxWidth: '150px',
                                        maxHeight: '150px',
                                    }}
                                    alt=""
                                    src={message.text.replace(':sticker:', '')}
                                />
                            ) :
                            (
                                message.text
                            )}

                    </Text>
                );
            })}
        </Box>
    )
}